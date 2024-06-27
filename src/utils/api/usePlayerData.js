import { _settings } from "../softphone/_settings";

export const usePlayerData = async (number) => {
  if (!number) {
    console.error("Expected number...");
    return;
  }

  _settings.playersData = [];

  const playerDataApi = `${_settings.configuration.root}/api_user_data_by_phone/?phone=${number}`;
  const fetchData = await fetch(playerDataApi);
  const {result} = await fetchData.json();

  _settings.playersData = result;
  return result;
};
