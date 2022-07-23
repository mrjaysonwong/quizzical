export default function Settings(props) {
  return (
    <div>
      <form className="form-settings">
        <label className="settings-label">Select Category:</label>
        <select
          className="settings-select"
          onChange={(e) => props.handleCategory(e.target.value)}
        >
          {props.options.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {item.value}
              </option>
            );
          })}
        </select>
      </form>
    </div>
  );
}
