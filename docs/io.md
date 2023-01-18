### fromArrow

Returns a new TimeFrame from an arrow dataset

```typescript
fromArrow(data: Table) : TimeFrame
```

### fromParquet

Returns a new TimeFrame from a Parquet dataset

```typescript
fromParquet(buffer: Buffer) : TimeFrame
```

### toArrow

Converts a TimeFrame to Arrow data format

```typescript
toArrow(tf: TimeFrame) : Table
```

### toParquet

Converts a TimeFrame to Parquet data format

```typescript
toParquet(tf: TimeFrame) : Buffer
```