function StyledTextField({
  type,
  name,
  onChange,
}: {
  type: string;
  name: string;
  onChange: (e: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement; }) => Promise<void>;
}) {
  return (
    <div style={{ width: 'calc(100% - 3rem)', 'margin-left': 'auto', 'margin-right': 'auto' }}>
      <input type={type} name={name} style={{ padding: '0.5rem' }} onChange={onChange}></input>
    </div>
  );
}

export default StyledTextField;
