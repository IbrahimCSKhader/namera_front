export type CustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};

export type UpdateCustomerProfileRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};
