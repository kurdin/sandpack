import { standardizeTheme, standardizeStitchesTheme } from ".";

describe(standardizeTheme, () => {
  it("should return the default theme", () => {
    const input = standardizeTheme();

    expect(input).toMatchSnapshot();
  });

  it("should return the `dark` theme", () => {
    const input = standardizeTheme("dark");

    expect(input).toMatchSnapshot();
  });

  it("should return a custom theme merged with the default", () => {
    const input = standardizeTheme({ colors: { accent: "blue" } });

    expect(input).toMatchSnapshot();
    expect(input.id).toBe("sp-1420813869");
  });

  it("should return a custom theme", () => {
    const input = standardizeTheme({
      colors: {
        activeText: "red",
        defaultText: "red",
        inactiveText: "red",
        activeBackground: "red",
        defaultBackground: "red",
        inputBackground: "red",
        accent: "red",
        errorBackground: "red",
        errorForeground: "red",
      },
      syntax: {
        plain: "blue",
        comment: "blue",
        keyword: "blue",
        tag: "blue",
        punctuation: "blue",
        definition: "blue",
        property: "blue",
        static: "blue",
        string: "blue",
      },
      font: {
        body: "",
        mono: "",
        size: "14px",
        lineHeight: "1.4",
      },
    });

    expect(input).toMatchSnapshot();
  });
});

describe(standardizeStitchesTheme, () => {
  it("converts a theme to the stitches format", () => {
    const { theme } = standardizeTheme({
      colors: {
        activeText: "red",
        defaultText: "red",
        inactiveText: "red",
        activeBackground: "red",
        defaultBackground: "red",
        inputBackground: "red",
        accent: "red",
        errorBackground: "red",
        errorForeground: "red",
      },
      syntax: {
        plain: { color: "blue", fontStyle: "italic" },
        comment: "blue",
        keyword: "blue",
        tag: "blue",
        punctuation: "blue",
        definition: { color: "green", fontStyle: "italic" },
        property: "blue",
        static: "blue",
        string: "blue",
      },
      font: {
        body: "",
        mono: "",
        size: "14px",
        lineHeight: "1.4",
      },
    });
    const input = standardizeStitchesTheme(theme);

    expect(input).toMatchSnapshot();
  });
});
