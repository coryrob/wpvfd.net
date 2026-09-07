const membershipGrid = document.getElementById("membership-grid");
const members = Array.isArray(window.membershipData) ? window.membershipData : [];

if (membershipGrid) {
  members.forEach((member) => {
    if (!member || !member.name || !member.rank) return;

    const card = document.createElement("article");
    card.className = "panel member-card";

    const portrait = document.createElement("div");
    portrait.className = "member-portrait";
    const fallback = document.createElement("p");
    fallback.className = "member-photo-fallback";
    fallback.textContent = "Photo coming soon";
    portrait.append(fallback);

    if (member.photo) {
      const image = document.createElement("img");
      image.alt = member.name;
      image.loading = "lazy";
      image.width = 880;
      image.height = 1100;
      image.addEventListener("load", () => { fallback.hidden = true; });
      image.addEventListener("error", () => { image.remove(); fallback.hidden = false; });
      image.src = member.photo;
      portrait.append(image);
    }

    const details = document.createElement("div");
    details.className = "member-details";
    const rank = document.createElement("p");
    rank.className = "member-rank";
    const rankParts = member.rank.match(/^(.+?)\s*\((.+)\)$/);
    rank.textContent = rankParts ? rankParts[1] : member.rank;
    const name = document.createElement("h3");
    name.textContent = member.name;
    details.append(name, rank);
    if (rankParts) {
      const assignment = document.createElement("p");
      assignment.className = "member-assignment";
      assignment.textContent = rankParts[2];
      details.append(assignment);
    }
    card.append(portrait, details);
    membershipGrid.append(card);
  });

  document.getElementById("membership-empty").hidden = membershipGrid.childElementCount > 0;
}
