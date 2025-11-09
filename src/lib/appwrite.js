import { Client, TablesDB, Account, Storage, ID, Query, Permission, Role } from 'appwrite';

const client = new Client().setEndpoint('https://fra.cloud.appwrite.io/v1').setProject('metromale');
// .setDevKey('228ebf1ad0135f643b0fae6961c7363fda3bfbb62e53adb5bf855efb8d70b206e2a6c48f5eabaa75039f9692be6576d7a97ddc28e9e03703bd69e7a88be892d340c2a3a25e24395f23f0e95ebf22e14db5ae015af48140f5c19b79c3e1cde785c8f9a9b17754f707344f7cf98391f5f2c765ba2500b8fa76305582c02c80bf24');

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);

export { ID, Query, Permission, Role };
