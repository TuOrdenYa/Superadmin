// Small utility to set a transient lead source in sessionStorage
export function setLeadSource(source: string) {
  try {
    sessionStorage.setItem("leadSource", source);
  } catch (err) {
    // ignore (SSR or storage disabled)
  }
}

export default setLeadSource;
