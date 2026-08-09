import * as z from "zod";

export type ApiResponse<T = null> = {
  data: T;
  message: string;
};

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) => {
  return z.object({
    data: dataSchema,
    message: z.string(),
  });
};
