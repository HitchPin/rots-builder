import { describe, test, expect } from 'vitest';
import { z } from "zod";
import { generateError } from "zod-error";
import type { Expect, Equal } from "./TypeUtil.js";
import { toZodBuilder } from "../src/factories.js";

type Props = z.infer<typeof FargateCapacityProviderSchema>;

class PropsWrapper {
  #props: Props;
  constructor(innerP: Props) {
    this.#props = innerP;
  }

  get innerProps(): Props {
    return this.#props;
  }
}

describe("ZodBuild tests", () => {
  test("Can build a custom value only from Zod schema.", () => {
    let contactUpper = toZodBuilder(FargateCapacityProviderSchema);
    contactUpper.withCpuArchitecture("ARM64").build();
    const cc = contactUpper
      .withCpuArchitecture("ARM64")
      .withType("FARGATE")
      .withVCPUs(4)
      .withMemoryMB(400)
      .build();

    const parseResult = FargateCapacityProviderSchema.safeParse(cc);
    expect(parseResult.success).toBe(true);

    // @ts-check
    const p: Props = cc;
  });

  test("Can build a custom value with a custom builder.", () => {
    let contactUpper = toZodBuilder(FargateCapacityProviderSchema, {
      customBuilder: (o) => {
        return new PropsWrapper(o!);
      }
    });
    const cc = contactUpper
      .withCpuArchitecture("ARM64")
      .withType("FARGATE")
      .withVCPUs(4)
      .withMemoryMB(400)
      .build();

    expect(cc).toBeInstanceOf(PropsWrapper);
    const parseResult = FargateCapacityProviderSchema.safeParse(cc.innerProps);
    if (parseResult.success === false) {
      const ze = generateError(parseResult.error);
      throw ze;
    }
    expect(parseResult.success).toBe(true);

    // @ts-expect-error
    const zz: Props = cc;
  });

  test("Uses seeded values if present", () => {
    let contactUpper = toZodBuilder(FargateCapacityProviderSchema, {
      initialValues:{
        cpuArchitecture: "X86_64",
      }
    });
    expect(contactUpper.cpuArchitecture).toBe("X86_64");
    const cb = contactUpper.build();
    expect(cb.cpuArchitecture).toBe("X86_64");
    expect(cb.memoryMB).toBe(1024);
  });

  test("Uses seeded values if present with custom builder", () => {
    let contactUpper = toZodBuilder(
      FargateCapacityProviderSchema, {
        initialValues: {
          cpuArchitecture: 'ARM64'
       },
       // @ts-expect-error
       customBuilder: (o) => new PropsWrapper(o)
    });
    const cc = contactUpper;
    expect(cc.cpuArchitecture).toBe("ARM64");
    const cb = cc.build();
    expect(cb.innerProps.cpuArchitecture).toBe("ARM64");
    expect(cb.innerProps.memoryMB).toBe(1024);
  });
});

interface ICreds {
  create: () => string;
}
function IsCreds(a: any): a is ICreds {
  return typeof a === "object";
}

const PropsSchema = z.object({
  endpoint: z.string().url().optional(),
  credentialProvider: z
    .custom<ICreds>((a) => IsCreds(a))
    .refine((a) => a as ICreds)
    .optional(),
});
type ExpectedProps = {
  credentialProvider?: ICreds;
  endpoint?: string;
};
type ActualProps = z.infer<typeof PropsSchema>;

type cases = [Expect<Equal<ExpectedProps, ActualProps>>];
const FargateCapacityProviderSchema = z.object({
  type: z.literal("FARGATE"),
  vCPUs: z.number().min(0.25).max(8),
  memoryMB: z.number().default(1024),
  cpuArchitecture: z.enum(["X86_64", "ARM64"]),
});