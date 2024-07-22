export interface IUser {
  id: string;
    name: string;
    email: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripeSubscriptionStatus: string | null;
    createdAt: Date;
    updatedAt: Date;
}