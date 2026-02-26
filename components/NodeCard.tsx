"use client";

import type { GraphNode } from "@/data/validated-data";
import type { Person, Restaurant, Group } from "@/data/types";
import { data } from "@/data/validated-data";

interface NodeCardProps {
  node: GraphNode;
  onClose: () => void;
}

function PersonCard({ person }: { person: Person }) {
  // Count active/closed restaurants this person is connected to
  const connections = data.relationships.filter(
    (r) => r.source === person.id && (r.type === "opened_new" || r.type === "founded")
  );
  const connectedRestaurants = connections
    .map((c) => data.restaurants.find((r) => r.id === c.target))
    .filter(Boolean);
  const active = connectedRestaurants.filter((r) => r?.status === "active").length;
  const closed = connectedRestaurants.filter((r) => r?.status === "closed").length;

  // Get connection names
  const connectionNames = connections
    .map((c) => {
      const r = data.restaurants.find((r) => r.id === c.target);
      return r?.name;
    })
    .filter(Boolean);

  const tagLabel = person.tags.includes("chef")
    ? "CHEF"
    : person.tags.includes("sommelier")
      ? "SOMMELIER"
      : person.tags.includes("founder")
        ? "FOUNDER"
        : person.tags.includes("leadership")
          ? "LEADERSHIP"
          : person.tags.includes("marketing")
            ? "MARKETING"
            : person.tags.includes("tech")
              ? "TECHNOLOGY"
              : "INDUSTRY";

  return (
    <>
      <div className="text-[10px] tracking-[0.08em] opacity-50 font-sans uppercase">
        {tagLabel}
        {person.active_since ? ` \u00B7 Active since ${person.active_since}` : ""}
      </div>

      <h3 className="text-xl font-bold mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
        {person.name}
      </h3>

      {connectionNames.length > 0 && (
        <p
          className="text-sm mt-0.5"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            color: "#6E79D6",
          }}
        >
          {connectionNames.join(" \u00B7 ")}
        </p>
      )}

      <div className="w-8 h-px bg-black/10 my-3" />

      <p
        className="text-[13px] leading-relaxed opacity-80"
        style={{ fontFamily: "'Spectral', serif" }}
      >
        {person.bio}
      </p>

      {(active > 0 || closed > 0) && (
        <p className="text-[11px] opacity-50 mt-3 font-sans">
          {active} active{closed > 0 ? ` \u00B7 ${closed} closed` : ""}
        </p>
      )}
    </>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  // Find people connected to this restaurant
  const connectedPeople = data.relationships
    .filter((r) => r.target === restaurant.id && r.source !== restaurant.group)
    .map((r) => {
      const person = data.people.find((p) => p.id === r.source);
      return person ? { name: person.name, role: r.label } : null;
    })
    .filter(Boolean);

  return (
    <>
      <div className="text-[10px] tracking-[0.08em] opacity-50 font-sans uppercase">
        RESTAURANT \u00B7 {restaurant.status === "active" ? "OPEN" : `CLOSED ${restaurant.closed ?? ""}`}
      </div>

      <h3 className="text-xl font-bold mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
        {restaurant.name}
      </h3>

      <p
        className="text-sm mt-0.5 opacity-60"
        style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
      >
        {restaurant.neighborhood ? `${restaurant.neighborhood}, ` : ""}
        {restaurant.city} \u00B7 Est. {restaurant.opened}
      </p>

      {connectedPeople.length > 0 && (
        <>
          <div className="w-8 h-px bg-black/10 my-3" />
          <div className="space-y-1">
            {connectedPeople.map((p, i) => (
              <p key={i} className="text-[12px] font-sans">
                <span className="font-medium">{p!.name}</span>
                {p!.role && (
                  <span className="opacity-50 ml-1">— {p!.role}</span>
                )}
              </p>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function GroupCard({ group }: { group: Group }) {
  // Count restaurants in group
  const restaurants = data.restaurants.filter((r) => r.group === group.id);
  const active = restaurants.filter((r) => r.status === "active").length;
  const closed = restaurants.filter((r) => r.status === "closed").length;

  return (
    <>
      <div className="text-[10px] tracking-[0.08em] opacity-50 font-sans uppercase">
        {group.type.toUpperCase().replace("_", " ")} \u00B7 EST. {group.founded}
      </div>

      <h3 className="text-xl font-bold mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
        {group.name}
      </h3>

      <div className="w-8 h-px bg-black/10 my-3" />

      <p
        className="text-[13px] leading-relaxed opacity-80"
        style={{ fontFamily: "'Spectral', serif" }}
      >
        {group.description}
      </p>

      {(active > 0 || closed > 0) && (
        <p className="text-[11px] opacity-50 mt-3 font-sans">
          {active} active{closed > 0 ? ` \u00B7 ${closed} closed` : ""}
          {" restaurant"}
          {active + closed !== 1 ? "s" : ""}
        </p>
      )}
    </>
  );
}

export default function NodeCard({ node, onClose }: NodeCardProps) {
  return (
    <div className="bg-[#FAFAF7] border border-black/8 rounded-sm p-5 w-[280px] shadow-sm relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-black/30 hover:text-black/60 transition-colors text-sm font-sans"
        aria-label="Close"
      >
        &times;
      </button>

      {node.kind === "person" && <PersonCard person={node.data as Person} />}
      {node.kind === "restaurant" && <RestaurantCard restaurant={node.data as Restaurant} />}
      {node.kind === "group" && <GroupCard group={node.data as Group} />}
    </div>
  );
}
