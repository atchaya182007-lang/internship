function ItemCard({
  item,
  onClick,
}) {
  const isFound =
    item.status === "Found";

  return (
    <article
      className="item-card"
      onClick={onClick}
    >

      <div className="item-image">

        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
          />
        ) : (
          <div className="image-placeholder">
            {item.category
              ?.charAt(0)
              ?.toUpperCase() || "?"}
          </div>
        )}

        <span
          className={`status-pill ${
            isFound
              ? "found"
              : "lost"
          }`}
        >
          {isFound
            ? "Found"
            : "Lost"}
        </span>

      </div>

      <div className="item-content">

        <div className="item-meta">

          <span>
            {item.category}
          </span>

          <time>
            {item.date}
          </time>

        </div>

        <h3>
          {item.title}
        </h3>

        <p className="location">
          <span>⌖</span>
          {item.location}
        </p>

      </div>

    </article>
  );
}

export default ItemCard;