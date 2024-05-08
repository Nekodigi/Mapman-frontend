import { Account } from "@/type/account";

//define converter
export const accountConverter = {
  toFirestore: (account: Account) => {
    account.profiles = account.profiles.map((profile) => {
      profile.locations = profile.locations.map((loc) => {
        if (loc.hours) {
          loc.hours = loc.hours.map((hour) => {
            return { open: hour[0], close: hour[1] };
          }) as any;
        }
        return loc;
      });
      return profile;
    }) as any;
    return account;
  },
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    data.profiles = data.profiles.map((profile: any) => {
      profile.locations = profile.locations.map((loc: any) => {
        if (loc.hours) {
          loc.hours = loc.hours.map((hour: any) => {
            return [hour.open, hour.close];
          }) as any;
        }
        return loc;
      });
      return profile;
    }) as any;
    return data;
  },
};
