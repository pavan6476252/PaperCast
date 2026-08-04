import { useMemo } from "react";
import { resolvePath, DotPaths, DefaultTData } from "@papercast/engine";
import { usePaperCastContext } from "../PaperCastProvider";

export function useNodeData<TData = DefaultTData>() {
  const { data, pageContext } = usePaperCastContext<TData>();

  const resolve = useMemo(() => {
    return (path: DotPaths<TData> | string) => {
      return resolvePath(data as Record<string, unknown>, path as string);
    };
  }, [data]);

  return { data, pageContext, resolve };
}
