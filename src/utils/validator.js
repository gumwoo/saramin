export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  export const validateJobInput = (data) => {
    const errors = [];
    
    if (!data.title) errors.push('Title is required');
    if (!data.description) errors.push('Description is required');
    if (!data.location) errors.push('Location is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };