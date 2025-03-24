import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export const TripsList = ({ trips }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TripCard trip={trips[index]} />
    </div>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={trips.length}
          itemSize={300} // Adjust based on your card height
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
};
