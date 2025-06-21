export interface AuthenticatedUser {
  access_token?: string;
  user: { id?: string; name?: string; type: string; roles?: string[] };
}
