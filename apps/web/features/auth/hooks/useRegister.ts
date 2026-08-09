import { useMutation } from "@tanstack/react-query";

import { register } from "../api/register";
import { redirect } from "next/navigation";

export function useRegister() {
  return useMutation({
    mutationFn: register,
    onSuccess: () => redirect("/login")
  });
}
