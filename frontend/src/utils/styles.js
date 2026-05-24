export const styles = {
  app: { fontFamily: 'Poppins, sans-serif', color: '#f4f4f4', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f1f, #1c2541)' },
  nav: { display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid rgba(255,255,255,0.1)' },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#00c6ff' },
  menu: { display: 'flex', gap: '20px', listStyle: 'none', margin: 0 },
  link: { textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' },

  hero: { textAlign: 'center', padding: '80px 20px' },
  heroTitle: { fontSize: '3rem', marginBottom: '20px', lineHeight: '1.2' },
  heroSubtitle: { fontSize: '1.2rem', color: '#ccc', marginBottom: '40px' },
  btnGroup: { display: 'flex', justifyContent: 'center', gap: '15px' },

  btnPrimary: { background: 'linear-gradient(90deg, #00c6ff, #0072ff)', border: 'none', padding: '10px 25px', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', justifyContent:'center' },
  btnSecondary: { background: 'transparent', border: '1px solid #555', padding: '10px 25px', color: '#fff', borderRadius: '8px', cursor: 'pointer' },

  container: { maxWidth: '1200px', margin: '0 auto', padding: '30px' },

  featuresSection: { display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '50px' },
  featureCard: { width: '300px', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }
};
