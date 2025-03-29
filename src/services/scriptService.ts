import { ChatOpenAI } from "@langchain/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

export interface ScriptContent {
  title: string;
  content: string;
  url: string;
  metadata: {
    year?: number;
    writer?: string;
    genre?: string[];
  };
}

class ScriptService {
  private vectorStore: MemoryVectorStore | null = null;
  private embeddings: OpenAIEmbeddings;
  private model: ChatOpenAI;

  constructor() {
    // Initialize with your OpenAI API key
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.VITE_OPENAI_API_KEY,
    });
    this.model = new ChatOpenAI({
      openAIApiKey: process.env.VITE_OPENAI_API_KEY,
      modelName: "gpt-4-turbo-preview",
    });
  }

  async fetchScript(title: string): Promise<ScriptContent | null> {
    try {
      // Format the title for URL
      const formattedTitle = title.toLowerCase().replace(/\s+/g, '-');
      const url = `https://www.imsdb.com/scripts/${formattedTitle}.html`;

      // Load the script page
      const loader = new CheerioWebBaseLoader(url);
      const docs = await loader.load();

      // Extract the script content
      const scriptContent = docs[0].pageContent;
      
      // Split the content into chunks for better processing
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunks = await splitter.splitText(scriptContent);

      // Store in vector database for semantic search
      if (!this.vectorStore) {
        this.vectorStore = await MemoryVectorStore.fromTexts(
          chunks,
          [{ title }],
          this.embeddings
        );
      }

      return {
        title,
        content: scriptContent,
        url,
        metadata: {
          // Extract metadata using AI
          year: await this.extractYear(scriptContent),
          writer: await this.extractWriter(scriptContent),
          genre: await this.extractGenres(scriptContent),
        },
      };
    } catch (error) {
      console.error('Error fetching script:', error);
      return null;
    }
  }

  async analyzeScript(script: ScriptContent, question: string): Promise<string> {
    try {
      const response = await this.model.invoke([
        {
          role: "system",
          content: `You are a screenplay analysis expert. Analyze the following script and answer the user's question. 
                   Focus on providing detailed, insightful analysis that helps understand the screenplay's structure, 
                   character development, themes, and writing techniques.`
        },
        {
          role: "user",
          content: `Script: ${script.title}\n\nQuestion: ${question}\n\nScript Content: ${script.content}`
        }
      ]);

      return response.content;
    } catch (error) {
      console.error('Error analyzing script:', error);
      return 'Sorry, there was an error analyzing the script. Please try again.';
    }
  }

  private async extractYear(content: string): Promise<number | undefined> {
    try {
      const response = await this.model.invoke([
        {
          role: "system",
          content: "Extract the year of release from the script content. Return only the year as a number."
        },
        {
          role: "user",
          content: content
        }
      ]);

      return parseInt(response.content);
    } catch (error) {
      console.error('Error extracting year:', error);
      return undefined;
    }
  }

  private async extractWriter(content: string): Promise<string | undefined> {
    try {
      const response = await this.model.invoke([
        {
          role: "system",
          content: "Extract the writer's name from the script content. Return only the name."
        },
        {
          role: "user",
          content: content
        }
      ]);

      return response.content;
    } catch (error) {
      console.error('Error extracting writer:', error);
      return undefined;
    }
  }

  private async extractGenres(content: string): Promise<string[]> {
    try {
      const response = await this.model.invoke([
        {
          role: "system",
          content: "Extract the genres from the script content. Return them as a comma-separated list."
        },
        {
          role: "user",
          content: content
        }
      ]);

      return response.content.split(',').map(genre => genre.trim());
    } catch (error) {
      console.error('Error extracting genres:', error);
      return [];
    }
  }
}

export const scriptService = new ScriptService(); 