export const getMovieDescription = (description) => {
  if (!description) return "Sem descrição disponível.";
  return description;
}

export const getMovieRuntime = (runtime) => {
  if (!runtime || runtime <= 0) return "Desconhecida";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}min`;
}

export const getRatingBySource = (ratings, source) => {
  const rating = ratings?.find((r) => r.Source === source);
  if (!rating) return false;
  const value = rating.Value.split('/')[0].trim();
  return value;
}

export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

export const removeDuplicateReviews = (reviews) => {
  const uniqueReviews = [];
  const seenContents = new Set();
  for (const review of reviews) {
    if (review.content && !seenContents.has(review.content)) {
      uniqueReviews.push(review);
      seenContents.add(review.content);
    }
  }
  return uniqueReviews;
}