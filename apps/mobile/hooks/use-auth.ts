import { useQuery } from "@tanstack/react-query";

import { getSessionQueryFunction } from "~/api/session.api";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getSessionQueryFunction,
    staleTime: Infinity,
  });

  return query;
};

export default useAuth;
