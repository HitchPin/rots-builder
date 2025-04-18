import { describe, test, expect } from 'vitest';
import { toZodBuilder } from "../src/factories.js";
import { z } from "zod";

const PhoneNumSym: unique symbol = Symbol("PhoneNum");

const InternationalPhoneRegex = /^\+(?:[0-9]●?){6,14}[0-9]$/;

const PhoneNumberSchema = z
  .string()
  .regex(InternationalPhoneRegex)
  .brand(PhoneNumSym);

const PhoneSchema = z.object({
  Cell: PhoneNumberSchema,
  Home: PhoneNumberSchema.optional(),
  Work: PhoneNumberSchema,
});

const ContactSchema = z.object({
  City: z.string(),
  State: z.string(),
  AddressLine2: z.string(),
  Country: z.string(),
  Phone: PhoneSchema,
});
type ContactDetail = z.infer<typeof ContactSchema>;

const upperContact: ContactDetail = {
  City: "Arlington",
  State: "TX",
  AddressLine2: "1002 Hunter",
  Country: "US",
  Phone: {
    Work: PhoneNumberSchema.parse("+18171234567"),
    Cell: PhoneNumberSchema.parse("+18171234567"),
  },
};

const rob = () => toZodBuilder(ContactSchema);
const rop = () => toZodBuilder(PhoneSchema);

describe("Nested Tests", () => {
  const phoneBuilder = rop().withCell(PhoneNumberSchema.parse("+118171234567"));
  test("Properties return as expected", () => {
    const b = rob().withPhone(phoneBuilder).build();

    expect(b!);
  });
});
