const baseUrl = `http://localhost:3001`;


function toTeam(team) {
  if (team) {
    return  {
      id: team.id,
      name: team.name,
    };
  }
  return null;
}

export function getAllTeams() {
  let url = `${ baseUrl }/teams`;
  return fetch(url).then((res) => {
    return res.json();
  }).then((teams) => {
    return teams.map(team => toTeam(team));
  });
}