function Lista({ datos }) {
  return (
    <ul>
      {datos.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
export default Lista;