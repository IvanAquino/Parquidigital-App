# Parquidigital App
Concepto parquímetro digital

## Stack
- React Native

## Uso

```
npm install
```

#### Configuración mapas - Android
El proyecto usa los mapas de google debera ingresar su api key en el archivo ___AndroidManifest.xml___

#### Error en react-native-maps
Si tienes el siguiente error
_'.../node_modules/react-native-maps/lib/android/build.gradle' line: 20_
_> Could not get unknown property 'supportLibVersion' for object of type org.gradle.api.internal.artifacts.dsl.dependencies.DefaultDependencyHandler._

Agrega la siguiente linea en ese archivo aproximadamente la linea 19-20
```
dependencies {
  def supportLibVersion = safeExtGet('supportLibVersion', '28.0.0')
  ...
}
```

## Video demostración
[https://youtu.be/kgtPD0c-p4s](https://youtu.be/kgtPD0c-p4s) 

## Proyectos relacionados

- [Api: https://github.com/IvanAquino/ParquiDigital-Api](https://github.com/IvanAquino/ParquiDigital-Api) 
- [Admin: https://github.com/IvanAquino/ParquiDigital-Admin](https://github.com/IvanAquino/ParquiDigital-Admin) 