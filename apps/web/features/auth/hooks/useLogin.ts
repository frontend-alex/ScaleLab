import { useMutation } from "@tanstack/react-query";

import { login } from "../api/login";
import { redirect } from "next/navigation";

export function useLogin() {
  const { mutateAsync, isPending, isError } =  useMutation({
    mutationFn: login,
    onSuccess: () => redirect("/app")
  });

  return { mutateAsync, isPending, isError }
}
