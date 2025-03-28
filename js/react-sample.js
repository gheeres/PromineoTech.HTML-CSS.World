

function CitiesTable(props) {
  return(
    <html>
      <tbody>
        <tr></tr>
      </tbody> 
    </html>
  ); 
}

function CountryPage(props) {
  return (
    <>
      <h2>{ props.name }</h2>
      <CitiesTable />
    </>
  ); 
}