import UsersTable from "./DB/UsersTable";

let usersTable = new UsersTable();

import bcrypt from "bcryptjs/dist/bcrypt";

export default async function authenticate(email : string, password : string) : Promise<any> {
  try {
    let profile : UserProfile | undefined = await usersTable.getByEmail(email);
    if(!profile) throw new Error('Profile doesn\'t exist');
    let match = await bcrypt.compare(password, profile.password);
    if(!match) throw new Error('Invalid password');
    return profile;
  } catch(err) {
    throw err;
  }
}