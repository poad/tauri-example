function StyledTextField({
  type,
  name,
  onChange,
}: {
  type: string;
  name: string;
  onChange: (eR: React.FormEvent<HTMLInputElement>) => Promise<void>;
}) {
  return (
    <div style={{ width: 'calc(100% - 3rem)', marginLeft: 'auto', marginRight: 'auto' }}>
      <input type={type} name={name} style={{ padding: '0.5rem' }} onChange={onChange}></input>
    </div>
  );
}

export default StyledTextField;
