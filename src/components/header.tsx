interface Props {
    title:string;
    onTest:Function;
}
const Header = function(prop:Props) {
    return (
      <div>
        <header>
          <h1><a href="/" onClick={function(evt){
                evt.preventDefault();
                prop.onTest();
          }}>{prop.title}</a></h1>
        </header>
      </div>
    )
  }

  export default Header;