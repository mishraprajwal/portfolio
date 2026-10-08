const SectionDivider = ({ color = 'rgba(255,255,255,0.4)' }) => (
  <div className="warp-divider" style={{ '--warp-color': color }} aria-hidden="true" />
);

export default SectionDivider;
