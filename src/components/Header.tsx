interface HeaderProps {
    timeSinceLastSave: number | null;
  }
  
  const Header = ({ timeSinceLastSave }: HeaderProps) => (
    <h1 className="w-full p-4 ml-auto">
      {timeSinceLastSave || timeSinceLastSave === 0
        ? `Time since Last Save ${timeSinceLastSave} minutes`
        : ""}
    </h1>
  );
  
  export default Header;
  