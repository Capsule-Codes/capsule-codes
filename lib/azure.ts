import "server-only";
import { BlobServiceClient, type ContainerClient } from "@azure/storage-blob";

export function getContainerClient(): ContainerClient {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_CONTAINER_NAME;

  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING env var is required");
  }
  if (!containerName) {
    throw new Error("AZURE_CONTAINER_NAME env var is required");
  }

  // Clean the connection string of spaces and quotes
  const cleanConnectionString = connectionString
    .trim()
    .replace(/^["']|["']$/g, "");

  try {
    const serviceClient = BlobServiceClient.fromConnectionString(
      cleanConnectionString
    );
    return serviceClient.getContainerClient(containerName);
  } catch (error: any) {
    console.error("Error creating Azure Blob client:", {
      error: error.message,
      hasConnectionString: !!connectionString,
      connectionStringLength: connectionString.length,
      containerName,
      connectionStringStart: connectionString.substring(0, 50),
    });
    throw new Error(`Failed to create Azure Blob client: ${error.message}`);
  }
}
