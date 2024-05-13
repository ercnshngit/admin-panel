export const jsonParse = <T>(string: string) => {
  try {
    const jsonValue: T = JSON.parse(string);

    return jsonValue;
  } catch {
    return undefined;
  }
};

export const validateJson = (string: string) => {
  try {
    JSON.parse(string);

    return true;
  } catch (e) {
    return { error: (e as unknown as any).message };
  }
};
