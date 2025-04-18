import { describe, test, expect } from 'vitest';
import { toRoBuilder, toZodBuilder } from "../src/factories.js";

interface ContactDetail {
  City: string;
  State: string;
  AddressLine2: string;
  Country: string;
}

class Contact {
  readonly #c: ContactDetail;
  constructor(c: ContactDetail) {
    this.#c = c;
  }
  get City(): string {
    return this.#c.City;
  }
  get State(): string {
    return this.#c.State;
  }
  get AddressLine2(): string {
    return this.#c.AddressLine2;
  }
  get Country(): string {
    return this.#c.Country;
  }
}

const contactDetail: Partial<ContactDetail> = {
  City: undefined,
  State: undefined,
  AddressLine2: undefined,
  Country: undefined,
};

describe("Custom ROBuilder Tests", () => {
  test("Can build a custom type return as expected", () => {
    let contactUpper = toRoBuilder(contactDetail, (cd): Contact => {
      const c = new Contact(cd as ContactDetail);
      return c;
    });
    const cc = contactUpper
      .withState("TX")
      .withCity("Dallas")
      .withAddressLine2("202")
      .withCountry("USA")
      .build();
    expect(cc).toBeInstanceOf(Contact);
  });
});
