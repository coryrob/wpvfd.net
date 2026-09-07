const membershipGrid = document.getElementById("membership-grid");
const members = Array.isArray(window.membershipData) ? window.membershipData : [];

if (membershipGrid) {
  const rankGroups = new Map();

  members.forEach((member) => {
    if (!member || !member.name || !member.rank) return;

    const rankParts = member.rank.match(/^(.+?)\s*\((.+)\)$/);
    const rankName = rankParts ? rankParts[1] : member.rank;
    const groupName = rankName.includes("Chief")
      ? "Chief Officers"
      : rankName === "Firefighter" ? "Firefighters" : rankName;
    if (!rankGroups.has(groupName)) {
      rankGroups.set(groupName, []);
    }
    rankGroups.get(groupName).push({ member, rankParts });
  });

  rankGroups.forEach((groupMembers, rankName) => {
    const rankGroup = document.createElement("section");
    rankGroup.className = "membership-rank-group";
    const heading = document.createElement("h3");
    heading.className = "membership-rank-heading";
    heading.textContent = rankName;
    const rankGrid = document.createElement("div");
    rankGrid.className = "membership-rank-grid";
    rankGroup.append(heading, rankGrid);
    membershipGrid.append(rankGroup);

    groupMembers.forEach(({ member, rankParts }) => {

    const card = document.createElement("article");
    card.className = "panel member-card";

    const portrait = document.createElement("div");
    portrait.className = "member-portrait";
    const fallback = document.createElement("p");
    fallback.className = "member-photo-fallback";
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
    rankGrid.append(card);
    });
  });

}
