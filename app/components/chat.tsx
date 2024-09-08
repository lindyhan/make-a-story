"use client";

import { useState } from "react";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, append, isLoading } = useChat();

  const personalities = [
    { emoji: "😊", value: "Gullible" },
    { emoji: "😏", value: "Sarcastic" },
    { emoji: "😂", value: "Funny" },
  ];

  const presetCharacters = [
    { emoji: "👧", value: "Heidi" },
    { emoji: "👴", value: "Grandfather" },
    { emoji: "👩‍🦳", value: "Teacher" },
  ];

  const [state, setState] = useState({
    characterName: "",
    characterDescription: "",
    personality: "",
    presetCharacters: [],
  });

  const handleChange = ({
    target: { name, value, type, checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "checkbox") {
      setState((prevState) => ({
        ...prevState,
        presetCharacters: checked
          ? [...prevState.presetCharacters, value]
          : prevState.presetCharacters.filter((char) => char !== value),
      }));
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }
  };

  return (
    <main className="mx-auto w-full p-10 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Story Telling App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Create a character and customize their personality.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            {/* Left Column: Character Name and Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Character Name</h3>
              <input
                className="w-full p-2 rounded bg-gray-600 text-white"
                type="text"
                name="characterName"
                placeholder="Eg. Harry Potter, Arwen, X Æ A-Xii"
                value={state.characterName}
                onChange={handleChange}
              />

              <h3 className="text-xl font-semibold">Character Description</h3>
              <textarea
                className="w-full p-2 h-24 rounded bg-gray-600 text-white"
                name="characterDescription"
                placeholder="Eg. Tall, Green eyes, Smiley"
                value={state.characterDescription}
                onChange={handleChange}
              />
            </div>

            {/* Right Column: Personality and Preset Characters */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Personality</h3>
              <div className="flex flex-wrap justify-center">
                {personalities.map(({ value, emoji }) => (
                  <div
                    key={value}
                    className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                  >
                    <input
                      id={`personality-${value}`}
                      type="radio"
                      name="personality"
                      value={value}
                      onChange={handleChange}
                    />
                    <label className="ml-2" htmlFor={`personality-${value}`}>
                      {`${emoji} ${value}`}
                    </label>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold">Preset Characters</h3>
              <div className="flex flex-wrap justify-center">
                {presetCharacters.map(({ value, emoji }) => (
                  <div
                    key={value}
                    className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                  >
                    <input
                      id={`preset-${value}`}
                      type="checkbox"
                      name="presetCharacters"
                      value={value}
                      onChange={handleChange}
                      checked={state.presetCharacters.includes(value)}
                    />
                    <label className="ml-2" htmlFor={`preset-${value}`}>
                      {`${emoji} ${value}`}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || !state.characterName || !state.characterDescription || !state.personality}
            onClick={() =>
              append({
                role: "user",
                content: `Generate a story with the character "${state.characterName}" described as "${state.characterDescription}" with a ${state.personality} personality. ${
                  state.presetCharacters.length > 0
                    ? `Include the following preset characters: ${state.presetCharacters.join(", ")}.`
                    : ""
                }`,
              })
            }
          >
            Generate Story
          </button>

          <div
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
          >
            {messages[messages.length - 1]?.content}
          </div>    
        </div>
      </div>
    </main>
  );
}