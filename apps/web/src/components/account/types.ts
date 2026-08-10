export type AccountMenuItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  settings?: boolean;
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
};

export type Address = {
  name: string;
  line1: string;
  line2: string;
  country: string;
};
