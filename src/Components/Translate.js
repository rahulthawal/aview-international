import React, { useState, useEffect } from "react";
import { Form, TextArea, Button, Icon } from "semantic-ui-react";
import axios from "axios";
export default function Translate() {
  // To set the Joke from the API
  const [joke, setJoke] = useState("");
  // To set the translated result test
  const [resultText, setResultText] = useState("");
  // To set the selected language being set in the option
  const [selectedLanguageKey, setLanguageKey] = useState("");
  // To set all the language list available from the API
  const [languagesList, setLanguagesList] = useState([]);
  // To set the questionaire step in the process
  const [step, setStep] = useState(0);

  // The Language key encode Ex en means english
  const languageKey = (selectedLanguage) => {
    setLanguageKey(selectedLanguage.target.value);
  };
  // Disabled the Translate Button when language is not selected
  const isValid =
    selectedLanguageKey !== "Select" && selectedLanguageKey.trim().length > 0;

  /**
   * Function to get the random joke from the API
   */
  const getJoke = () => {
    try {
      axios
        .get("https://official-joke-api.appspot.com/random_joke")
        .then((response) => {
          setJoke(response.data.setup + " ... " + response.data.punchline);
          setStep(1);
          setResultText("");
          setLanguageKey("");
        });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  /**
   * Function to help detect which language the user has inputted.
   * query param {q:"text"}
   * response en
   */
  const getLanguageSource = async () => {
    try {
      const result = await axios.post(`https://libretranslate.de/detect`, {
        q: joke,
      });

      return result.data[0].language;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  /**
   * Function to translate the random joke into the language user has requested for
   * query param {q:"Hello",source:"en", target:"hi"}
   * response { output }
   */
  const translateText = async () => {
    try {
      const langSource = await getLanguageSource();
      let data = {
        q: joke,
        source: langSource,
        target: selectedLanguageKey,
      };
      axios
        .post(`https://libretranslate.de/translate`, data)
        .then((response) => {
          setResultText(response.data.translatedText);
        });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    try {
      axios.get(`https://libretranslate.de/languages`).then((response) => {
        setLanguagesList(response.data);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [joke]);
  return (
    <div style={{
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <div className="app-body">
        <div>
          {(step === 0 || step === 1 || step === 2) && (
            <div>
              <h2>Do you want to hear a Joke?</h2>
              <Button color="green" size="large" onClick={getJoke}>
                Yass, Please!!!!!
              </Button>
            </div>
          )}
        </div>

        <div className="app-display">
          {(step === 1 || step === 2) && (
            <Form>
              <Form.Field control={TextArea} value={joke} />
            </Form>
          )}
        </div>
        <div>
          {(step === 1 || step === 2) && (
            <div>
              <h2>Do you want to translate a Joke?</h2>
              <Button color="green" size="large" onClick={() => setStep(2)}>
                Yass, Please!!!!!
              </Button>
            </div>
          )}
        </div>
        {step === 2 && (
          <Form className="app-display">
            <select className="language-select" onChange={languageKey}>
              <option>Select</option>
              {languagesList.map((language) => {
                return (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                );
              })}
            </select>

            <Form.Field
              control={TextArea}
              value={resultText}
            />

            <Button
              disabled={!isValid}
              color="orange"
              size="large"
              onClick={translateText}
            >
              <Icon name="translate" />
              Translate
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
