import './style.css';

export function CircularProgress(params: {
  value: number
}) {
  return (
    <div className='circular-container'>
      <div className='circular-progress' style={{
        borderRadius: '50%',
        background: `conic-gradient(#00a63e ${Math.round(params.value) * 3.6}deg, #ededed 0deg)`,
      }}>
        <span className='progress-value'>
          {Math.round(params.value)}
        </span>
      </div>
    </div>
  );
}

export default CircularProgress;
