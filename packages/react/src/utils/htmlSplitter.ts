export function splitHtmlText(
  html: string,
  ratio: number
): [string, string] | null {
  if (ratio <= 0 || ratio >= 1) return null;

  // Split by HTML tags while keeping the tags in the array
  const tokens = html
    .split(/(<\/?(?:[a-z][a-z0-9]*)\b[^>]*>)/gi)
    .filter(Boolean);

  let pureText = "";
  for (const token of tokens) {
    if (!token.startsWith("<")) {
      pureText += token;
    }
  }

  if (pureText.length === 0) return null;

  let splitCharIndex = Math.floor(pureText.length * ratio);

  // Rewind to a word boundary to avoid cutting words in half
  while (
    splitCharIndex > 0 &&
    pureText[splitCharIndex] !== " " &&
    pureText[splitCharIndex] !== "\n"
  ) {
    splitCharIndex--;
  }

  if (splitCharIndex === 0) {
    splitCharIndex = Math.floor(pureText.length * ratio);
  }
  if (splitCharIndex === 0) return null;

  const chunk1Tokens: string[] = [];
  const chunk2Tokens: string[] = [];
  const openTags: string[] = [];
  const closingTags: string[] = [];

  let currentTextLength = 0;
  let splitFound = false;

  for (const token of tokens) {
    if (token.startsWith("<")) {
      if (splitFound) {
        chunk2Tokens.push(token);
      } else {
        chunk1Tokens.push(token);

        // Track open tags. Ignore self-closing tags like <br>, <img>, <hr>
        if (
          !token.endsWith("/>") &&
          !token.startsWith("</") &&
          !token.match(/^<(br|img|hr|input|meta|link)/i)
        ) {
          openTags.push(token);
          const tagNameMatch = token.match(/^<([a-z][a-z0-9]*)/i);
          if (tagNameMatch) {
            closingTags.push(`</${tagNameMatch[1]}>`);
          }
        } else if (token.startsWith("</")) {
          // Remove the last opened tag (assuming valid HTML structure)
          openTags.pop();
          closingTags.pop();
        }
      }
    } else {
      // It's a text node
      if (splitFound) {
        chunk2Tokens.push(token);
      } else {
        const nextLength = currentTextLength + token.length;
        if (nextLength >= splitCharIndex) {
          // Split happens inside this text token
          const splitPointInToken = splitCharIndex - currentTextLength;
          const t1 = token.substring(0, splitPointInToken);
          const t2 = token.substring(splitPointInToken).trimStart();

          if (t1) chunk1Tokens.push(t1);

          // For the second chunk, we must re-open all currently open tags
          // so the formatting continues perfectly.
          chunk2Tokens.push(...openTags);
          if (t2) {
            chunk2Tokens.push(t2);
          }

          splitFound = true;
          currentTextLength = splitCharIndex; // conceptual update
        } else {
          chunk1Tokens.push(token);
          currentTextLength = nextLength;
        }
      }
    }
  }

  // Close any tags that were left open in chunk 1
  for (let i = closingTags.length - 1; i >= 0; i--) {
    chunk1Tokens.push(closingTags[i]);
  }

  return [chunk1Tokens.join(""), chunk2Tokens.join("")];
}
