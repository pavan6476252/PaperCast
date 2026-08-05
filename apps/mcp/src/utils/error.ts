export function withErrorBoundary<Args extends unknown[], Ret>(
  fn: (...args: Args) => Promise<Ret>
): (
  ...args: Args
) => Promise<
  Ret | { isError: true; content: [{ type: "text"; text: string }] }
> {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Tool execution failed: ${errorMessage}`,
          },
        ],
      };
    }
  };
}
