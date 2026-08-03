import { useMemo } from "react";
import { resolvePath, DotPaths, DefaultTData } from "@formcast/engine";
import { useFormCastContext } from "../FormCastProvider";

export function useNodeData<TData = DefaultTData>() {
  const { data, pageContext } = useFormCastContext<TData>();

  const resolve = useMemo(() => {
    return (path: DotPaths<TData> | string) => {
      return resolvePath(data as Record<string, unknown>, path as string);
    };
  }, [data]);

  return { data, pageContext, resolve };
}
