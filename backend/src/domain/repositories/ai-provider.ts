export interface AiRequest {
  readonly question: string;
  readonly context: string;
}

export interface AiResponse {
  readonly text: string;
}

export interface AiProvider {
  generateResponse(request: AiRequest): Promise<AiResponse>;
}