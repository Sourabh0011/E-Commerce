// Pure TypeScript interface for frontend typing
export interface IUser {
  _id: string;
  clerkId?: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: Date;
}

// Default export to prevent breaking imports, though it won't be a Mongoose model
export default {} as any;
