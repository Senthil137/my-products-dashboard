export function handleErrors(error: Error) {
    if (error.message === 'Network Error') {
        return 'Network error occurred. Please check your internet connection.';
      } else {
        return `Error fetching categories: ${error.message}`;
      }
}