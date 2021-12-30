export default interface TimeVaryingAgent {
  onDayUpdate: (day: number) => void
}