# TrustLine
Ripple's interview problem, implemented in Swift.

## Usage 
#### Pre-reqs:
- `xcodebuild`: Download from App Store
- `carthage`: `$ brew install carthage`

### Build (requires root):
`./build_osx.sh`

### Run
```
# Run trustline on port 123, connecting to remote instance on 127.0.0.1:456.
./Products/Debug/Trustline 123 http://127.0.0.1:456
```