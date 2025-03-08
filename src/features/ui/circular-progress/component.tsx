import './style.css';

export function CircularProgress(params: {
  value: number
}) {
  return (
    <div class='circular-container'>
      <div class='circular-progress' style={{
        'border-radius': '50%',
        background: `conic-gradient(#ededed ${360 - Math.round(params.value) * 3.6}deg, #00a63e 0deg)`,
      }}>
        <span class='progress-value'>
          {Math.round(params.value)}
        </span>
      </div>
    </div>
  );
}

export default CircularProgress;
