import { Button, Dropdown, Menu } from "antd";
import { capitalize } from "../../explorer/utils/utils";

const ToolbarMenu = (props) => {
  const { snippets, activeSnippet, handleClickMenuItem } = props;

  // Determine the current language based on the activeSnippet
  const currentLanguage = activeSnippet.language ?? null;

  // Determine a list of all languages based on the provided snippets
  const languages = [
    ...new Set(snippets.map((snippet) => snippet.language)),
  ].sort((a, b) => a.localeCompare(b));

  // Build the language select menu based on the available languages
  const languagesMenuItems =
    languages.length > 0
      ? languages.map((language, i) => {
          return (
            <Menu.Item
              key={language}
              onClick={() => {
                console.log(`click ${language}`);
                handleClickMenuItem(language);
              }}
            >
              {capitalize(language)}
            </Menu.Item>
          );
        })
      : null;

  const languagesMenu = languagesMenuItems ? (
    <Menu>{languagesMenuItems}</Menu>
  ) : null;

  return (
    <>
      <Dropdown
        overlay={languagesMenu}
        arrow
        getPopupContainer={() =>
          window.document.getElementsByClassName(`graphiql-code-exporter`)[0]
        }
      >
        <Button type="default" onClick={(e) => e.stopPropagation()}>
          {currentLanguage}
        </Button>
      </Dropdown>
    </>
  );
};

export default ToolbarMenu;
